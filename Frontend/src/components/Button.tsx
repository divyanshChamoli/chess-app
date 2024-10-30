
interface ButtonProps{
  placeholder: string
}

function Button({placeholder}: ButtonProps) {
  return (
    <button
    className="text-white text-xl font-bold bg-customBlue-100 hover:bg-customBlue-200 px-16 py-4 rounded-lg">
    {placeholder}
  </button>
  )
}

export default Button