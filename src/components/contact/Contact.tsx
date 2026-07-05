import { useState } from "react";
import { apiRequest } from "../../services/httpClient";

type ContactErrors = {
    name?: string;
    email?: string;
    message?: string;
    form?: string;
};

function Contact() {
    const [email, setEmail] = useState("");
    const [nombre, setNombre] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<ContactErrors>({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const nextErrors: ContactErrors = {};
        const trimmedName = nombre.trim();
        const trimmedEmail = email.trim();
        const trimmedMessage = message.trim();

        if (!trimmedName) nextErrors.name = "El nombre es obligatorio.";
        if (!trimmedEmail) {
            nextErrors.email = "El email es obligatorio.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            nextErrors.email = "Ingresá un email válido.";
        }
        if (!trimmedMessage) {
            nextErrors.message = "La consulta es obligatoria.";
        } else if (trimmedMessage.length > 100) {
            nextErrors.message = "La consulta no puede superar los 100 caracteres.";
        }

        return nextErrors;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage("");

        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        try {
            setIsSubmitting(true);

            await apiRequest("/api/contact", {
                method: "POST",
                skipAuth: true,
                data: {
                    name: nombre.trim(),
                    email: email.trim(),
                    message: message.trim()
                }
            });

            setNombre("");
            setEmail("");
            setMessage("");
            setSuccessMessage("Tu consulta se envió correctamente.");
        } catch (error) {
            setErrors({
                form:
                    error && typeof error === "object" && "message" in error
                        ? String(error.message)
                        : "No pudimos enviar tu consulta. Intentá nuevamente."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="email">Email</label>
        <input
            type="email"
            id="email"
            placeholder="Escriba su email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-xl bg-sky-500/50 p-2 placeholder:text-white/90"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && <p id="email-error" className="text-sm text-red-300">{errors.email}</p>}
        <label htmlFor="name">Nombre</label>
        <input
            type="text"
            id="name"
            placeholder="Escriba su nombre"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            className="rounded-xl bg-sky-500/50 p-2 placeholder:text-white/90"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && <p id="name-error" className="text-sm text-red-300">{errors.name}</p>}
        <label htmlFor="message">Haga su consulta</label>
        <textarea
            placeholder="Escriba aca su consulta"
            name="message"
            id="message"
            value={message}
            maxLength={100}
            onChange={(event) => setMessage(event.target.value)}
            className="rounded-xl bg-sky-500/50 p-2 placeholder:text-white/90"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && <p id="message-error" className="text-sm text-red-300">{errors.message}</p>}
        {errors.form && <p className="text-sm text-red-300">{errors.form}</p>}
        {successMessage && <p className="text-sm text-emerald-300">{successMessage}</p>}
        <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-black px-4 py-2 text-white transition hover:-translate-y-1 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {isSubmitting ? "Enviando..." : "Enviar consulta"}
        </button>
        </form>
    );
}

export default Contact;
