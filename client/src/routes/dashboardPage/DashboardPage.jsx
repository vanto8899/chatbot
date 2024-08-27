import { useNavigate } from "react-router-dom";
import "./dashboardPage.css"
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DashboardPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Mutations
    const mutation = useMutation({
        mutationFn: (text) => {
            return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text })
            }).then((res) => res.json())
        },
        onSuccess: (id) => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["userChats"] });
            navigate(`/dashboard/chats/${id}`)
        },
    })

    const handleSubmit = async (e) => {
        e.preventDefault(e);
        const text = e.target.text.value;
        if (!text) return;

        mutation.mutate(text);
    }
    return (
        <div className="dashboardPage">
            <div className="texts">
                <div className="logo">
                    <img src="artificial-intelligence.png" alt="" />
                    <h1>TOPV AI</h1>
                </div>
                <div className="options">
                    <div className="option">
                        <img src="/chat.png" alt="" />
                        <span>Create a new chat</span>
                    </div>
                    <div className="option">
                        <img src="/image.png" alt="" />
                        <span>Analyze Images</span>
                    </div>
                    <div className="option">
                        <img src="/code.png" alt="" />
                        <span>Create a new chat</span>
                    </div>
                </div>
            </div>
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="text" placeholder="Ask me anything..." />
                    <button>
                        <img src="/arrow.png" alt="" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default DashboardPage