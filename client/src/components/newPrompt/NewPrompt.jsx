import { IKImage } from "imagekitio-react";
import Upload from "../upload/Upload";
import "./newPrompt.css";
import { useEffect, useRef, useState } from "react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {}
    });

    const chat = model.startChat({
        history: [
            data?.history.map(({ role, parts }) => (
                {
                    role,
                    parts: [{ text: parts[0].text }]
                }))
            /* {
                role: "user",
                parts: [{ text: "Hello" }],
            },
            {
                role: "model",
                parts: [{ text: "Great to meet you. What would you like to know?" }],
            }, */
        ],
        generationConfig: {
            //maxOutputTokens: 100
        }
    });

    const endRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" });
    }, [data, question, answer, img.dbData]);

    const queryClient = useQueryClient();
    // Mutations
    const mutation = useMutation({
        mutationFn: () => {
            return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: question.length ? question : undefined,
                    answer,
                    img: img.dbData?.filePath || undefined
                })
            }).then((res) => res.json())
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["chat", data._id] }).then(() => {
                formRef.current.reset()
                setQuestion("")
                setAnswer("")
                setImg({
                    ...prevImg,
                    isLoading: false,
                    error: ""
                    // Giữ nguyên `dbData` và `aiData` không thay đổi.
                })
            });
        },
        onError: (err) => {
            console.log(err)
        }
    })

    const add = async (text, isInitial) => {
        if (!isInitial) setQuestion(text);
        try {
            /* // Safely access img.aiData.text
            const promptText = img.aiData?.text || text;
            // Pass as an array or string based on expected input
            const result = await chat.sendMessageStream([promptText]);*/
            const result = await chat.sendMessageStream(
                Object.entries(img.aiData).length ? [img.aiData, text] : [text]
            );
            let accumulatedText = "";
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                accumulatedText += chunkText;
                setAnswer(accumulatedText);
            }

            mutation.mutate();

        } catch (error) {
            console.error("Error generating content:", error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const text = e.target.text.value;
        if (!text) return;

        await add(text, false);
        /* e.target.text.value = ""; */
    };

    const hasRun = useRef(false);

    useEffect(() => {
        if (!hasRun.current) {
            if (data?.history?.length === 1) {
                add(data.history[0].parts[0].text, true);
            }
        }
        hasRun.current = true;
    }, [])

    return (
        <>
            {/* ADD new a chat */}
            {img.isLoading && <div>Loading...</div>}
            {img.dbData?.filePath && (
                <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={img.dbData?.filePath}
                    height="300"
                    width="400"
                    transformation={[{ height: 300, width: 400 }]}
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                />
            )}
            {question && (
                <div className="message user">
                    <img src="/human1.jpeg" alt="Human" className="icon" />
                    {question}
                </div>
            )}
            {answer && (
                <div className="message">
                    <img src="/artificial-intelligence.png" alt="AI" className="icon" />
                    <Markdown>{answer}</Markdown>
                </div>
            )}
            <div className="endChat" ref={endRef}></div>
            <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
                <Upload setImg={setImg} />
                <input id="file" type="file" multiple={false} hidden />
                <input type="text" name="text" placeholder="Ask anything..." />
                <button type="submit">
                    <img src="/arrow.png" alt="Submit" />
                </button>
            </form>
        </>
    );
};

export default NewPrompt;
