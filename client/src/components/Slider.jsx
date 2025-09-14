export default function Slider({ value, onChange }) {
    const handleChange = (e) => {
      onChange(Number(e.target.value));
    };
  
    return (
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
        className="w-64 accent-green-500"
      />
    );
  }