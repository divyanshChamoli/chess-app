
interface ButtonProps{
  placeholder: string
  onClick(): void
}

function Button({placeholder ,onClick}: ButtonProps) {
  return (
    <button
    className="text-white md:text-xl text-lg font-bold bg-customBlue-100 hover:bg-customBlue-200 md:px-16 md:py-4 px-8 py-2 rounded-lg"
    onClick={onClick}
  >
    {placeholder}
  </button>
  )
}

export default Button