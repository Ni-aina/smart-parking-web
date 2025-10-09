export const customCheckStyle = `
    appearance-none
    bg-white/10
    w-4 h-4
    rounded-[5px]
    checked:before:content-['✔']
    checked:before:text-red-500
    checked:before:absolute
    checked:before:bottom-[1.5px]
    checked:before:right-[1.5px]
    cursor-pointer
`