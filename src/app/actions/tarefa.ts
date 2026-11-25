"use server";

export interface Tarefa{
    id: string;
    titulo: string;
    concluida: boolean;
}

import {revalidatePath} from "next/cache"

const tarefas: Tarefa[]=[
    {id: '1', titulo: "Estudar", concluida: false},
    {id: '2', titulo: "Comer", concluida: false},
]

export async function listarTarefas(): Promise<Tarefa[]>{
    return tarefas;
}

export async function criarTarefa(formData: FormData): Promise<void>{
    const titRaw=formData.get("titulo")
    const titulo=typeof titRaw === "string"? titRaw.trim(): ''

    if(!titulo){ return}

    tarefas.unshift({
        id: crypto.randomUUID(),
        titulo,
        concluida: false
    })

    // atualiza os dados exibidos na rota principal
    revalidatePath('/')
}

export async function alterarEstado(id:string): Promise<void> {
    const tarefa=tarefas.find((item)=>item.id === id)

    if(tarefa){
        tarefa.concluida=!tarefa.concluida
        revalidatePath('/')
    }
    
}


