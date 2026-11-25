import { pesquisaFilmes } from "@/app/lib/services/tmdb"

export async function GET(req: Request){
    const { searchParams }=new URL(req.url)
    const termo=searchParams.get("query")?.trim()

    if(!termo){
        return Response.json(
            {
                error: "Informe o titulo que deseja pesquisar"
            },
            { status: 400}
        )
    }
    try{
        const results=await pesquisaFilmes(termo)
        return Response.json(results)
    } catch(error){
        console.error("Erro na pesquisa TMDB", error)
    }
}