import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PokeBallList({ children }: Props) {
  return (
    <section className="mt-14 pb-10">
      <div className="grid grid-cols-5 place-items-center gap-[90px]">{children}</div>
    </section>
  )
}
