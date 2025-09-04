import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch jobs on load
  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    const { data, error } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setJobs(data);
  }

  async function addJob(e) {
    e.preventDefault();
    if (!title) return;
    const { error } = await supabase.from("jobs").insert([{ title, description }]);
    if (error) console.error(error);
    else {
      setTitle("");
      setDescription("");
      fetchJobs();
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🛠 Hustle Finder</h1>

      <form onSubmit={addJob} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Job title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: "8px", marginRight: "5px" }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: "8px", marginRight: "5px" }}
        />
        <button type="submit" style={{ padding: "8px" }}>Post</button>
      </form>

      <h2>Available Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs yet.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <strong>{job.title}</strong> — {job.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
