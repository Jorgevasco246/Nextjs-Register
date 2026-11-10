type OrderDetailPage = {
    params: Promise <{id?:string}>
}

export default async function OrderDetailPage({params}: OrderDetailPage) {
    const { id } = await params;

    return (
        <>
        <h1>El id de la orden es {id}</h1>
    </>
    )
}