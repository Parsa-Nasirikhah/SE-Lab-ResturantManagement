import { useParams } from "react-router-dom"

const OrderDetail = () => {
  const { id } = useParams()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        Order #{id}
      </h1>
      <p>Status, items, total price…</p>
    </div>
  )
}

export default OrderDetail