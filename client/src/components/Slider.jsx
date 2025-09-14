import "./Slider.css";

export default function Slider({ value, onChange }) {
  const handleChange = (e) => {
    onChange(Number(e.target.value));
  };

  return (
    <input
      type="range"
      min="500"
      max="2000"
      value={value}
      onChange={handleChange}
      className="slider"
      
    />
  );
}
