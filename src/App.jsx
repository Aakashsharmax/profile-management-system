import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");


    const [profiles, setProfiles] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [errors, setErrors] = useState({});

    const API_URL = "http://localhost:8080/profiles";

    const getProfiles = async () => {
        try {
            const response = await axios.get(API_URL);
            setProfiles(response.data);
        } catch (error) {
            console.error("Error fetching profiles:", error);
        }
    };

    useEffect(() => {
        async function fetchProfiles() {
            try {
                const response = await axios.get(API_URL);
                setProfiles(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        void fetchProfiles();
    }, []);

    const saveProfile = async (e) => {
        e.preventDefault();

        const validationErrors = {};

        if (!name.trim()) {
            validationErrors.name = "Name is required";
        }

        if (!email.trim()) {
            validationErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            validationErrors.email = "Invalid email";
        }

        if (!phone.trim()) {
            validationErrors.phone = "Phone is required";
        } else if (!/^\d{10}$/.test(phone)) {
            validationErrors.phone = "Phone must be 10 digits";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        const profile = {
            name,
            email,
            phone,
        };

        try {
            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, profile);
                alert("Profile Updated Successfully!");
            } else {
                await axios.post(API_URL, profile);
                alert("Profile Saved Successfully!");
            }

            await getProfiles();

            setName("");
            setEmail("");
            setPhone("");
            setEditingId(null);
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Error Saving Profile");
        }
    };
    const deleteProfile = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);

            alert("Profile Deleted Successfully!");

            await getProfiles();
        } catch (error) {
            console.error("Error deleting profile:", error);
            alert("Error Deleting Profile");
        }
    };
    const editProfile = (profile) => {
        setEditingId(profile.id);
        setName(profile.name);
        setEmail(profile.email);
        setPhone(profile.phone);
    };

    return (
        <div className="container">
            <h1>Profile Management System</h1>

            <form onSubmit={saveProfile}>
                <label>Name</label>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}


                <label>Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

                <label>Phone</label>
                <input
                    type="text"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}

                <button type="submit">
                    {editingId ? "Update Profile" : "Save Profile"}
                </button>
                {editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingId(null);
                            setName("");
                            setEmail("");
                            setPhone("");
                        }}
                    >
                        Cancel
                    </button>
                )}
            </form>
            <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <h2>All Profiles</h2>

            {profiles.length === 0 ? (
                <p>No Profiles Found</p>
            ) : (
                profiles
                    .filter((profile) =>
                        profile.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((profile) => (
                        <div key={profile.id} className="profile-card">
                        <p><strong>Name:</strong> {profile.name}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>

                        <button onClick={() => editProfile(profile)}>
                            Edit
                        </button>

                        <button
                            onClick={() => {
                                if (window.confirm("Are you sure you want to delete this profile?")) {
                                    void deleteProfile(profile.id);
                                }
                            }}
                        >
                            Delete
                        </button>

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}

export default App;