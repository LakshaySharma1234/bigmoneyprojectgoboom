import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export function CreateJobForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [staffType, setStaffType] = useState("");
  const [staffCount, setStaffCount] = useState(1);
  const [payPerHour, setPayPerHour] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      location,
      date,
      duration,
      staff_type: staffType,
      staff_count: staffCount,
      pay_per_hour: payPerHour,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="duration">Duration</Label>
        <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="staffType">Staff Type</Label>
        <Input id="staffType" value={staffType} onChange={(e) => setStaffType(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="staffCount">Staff Count</Label>
        <Input type="number" id="staffCount" value={staffCount} onChange={(e) => setStaffCount(parseInt(e.target.value))} required min="1" />
      </div>
      <div>
        <Label htmlFor="payPerHour">Pay Per Hour</Label>
        <Input type="number" id="payPerHour" value={payPerHour} onChange={(e) => setPayPerHour(parseFloat(e.target.value))} min="0" />
      </div>
      <Button type="submit">Create Job</Button>
    </form>
  );
}
