import { useParams } from "react-router-dom"

const MenuDetail = () => {
  const { id } = useParams()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        Menu Item #{id}
      </h1>
      <p className="mt-2 text-slate-600">
        Item description goes here.
      </p>
    </div>
  )
}

export default MenuDetail
