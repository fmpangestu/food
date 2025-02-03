import { useState } from "react";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    weight: "",
    height: "",
    age: "",
    gender: "male",
    activityLevel: "sedentary",
  });
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("User added successfully!");
      } else {
        setMessage(data.error || "Failed to add user");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="border rounded px-3 py-2"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="border rounded px-3 py-2"
      />
      <input
        type="number"
        name="weight"
        placeholder="Weight (kg)"
        value={formData.weight}
        onChange={handleChange}
        required
        className="border rounded px-3 py-2"
      />
      <input
        type="number"
        name="height"
        placeholder="Height (cm)"
        value={formData.height}
        onChange={handleChange}
        required
        className="border rounded px-3 py-2"
      />
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        required
        className="border rounded px-3 py-2"
      />
      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="border rounded px-3 py-2"
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <select
        name="activityLevel"
        value={formData.activityLevel}
        onChange={handleChange}
        className="border rounded px-3 py-2"
      >
        <option value="sedentary">Sedentary</option>
        <option value="light">Light</option>
        <option value="moderate">Moderate</option>
        <option value="active">Active</option>
      </select>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add User
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default AddUser;
