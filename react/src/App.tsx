// import React from 'react_nepomnyashiy';
// import {gql, useQuery} from "@apollo/client";
//
// function App() {
//
//     const GET_TODOS = gql`
//         query getTodos {
//           todos{
//             data{
//               id
//               title
//             }
//           }
//         }
//     `
//     const {loading, error, data} = useQuery<TodosData>(GET_TODOS);
//
//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error : {error.message}</p>;
//
//     return (<ul>
//         {
//             data?.todos.data.map((t) => <li>{t.title}</li>)
//         }
//     </ul>)
// }
//
// type TodosData = {
//     todos: {
//         data: {
//             id: number
//             title: string
//         }[]
//     }
// }
//
// export default App;


// import React from 'react';
// import {gql, useMutation} from "@apollo/client";
//
// function App() {
//
//     const ADD_TODO = gql`
//         mutation addTodo ($input:CreateTodoInput!){
//           createTodo (input:$input) {
//             id
//             title
//             completed
//           }
//         }
//     `
//
//     const [addTodo, {data, loading, error}] = useMutation(ADD_TODO, {
//         variables: {
//             "input": {
//                 "title": "new todo title",
//                 "completed": false
//             }
//         },
//     });
//
//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error : {error.message}</p>;
//
//     return (
//         <div>
//             <button onClick={() => addTodo({
//                 variables: {
//                     "input": {
//                         "title": "new new todo title",
//                         "completed": false
//                     }
//                 },
//             })}>
//                 add Todo
//             </button>
//             <ul>
//                 <li>{data?.createTodo.id}</li>
//                 <li>{data?.createTodo.title}</li>
//                 <li>{data?.createTodo.completed}</li>
//             </ul>
//         </div>
//     )
// }
//
// type TodoData = {
//     createTodo: {
//         id: number
//         title: string
//         completed: boolean
//     }
// }
//
// export default App;


import { gql, useMutation, useQuery } from "@apollo/client"

function App() {

  const GET_TODOS = gql`
    query getTodos {
      allTodos{
        id
        title
        user_id
        completed
      }
    }
    `

  const { loading, error, data }
    = useQuery<GetTodosData>(GET_TODOS)

  const ADD_TODO = gql`
      mutation addTodo ($title: String!, $user_id: ID!, $completed: Boolean!){
          createTodo(title:$title, user_id:$user_id, completed:$completed){
              id
              title
              user_id
              completed
          }
      }
  `

  const ADD_TODO_VARIABLES = {
    "title": "new todo title",
    "user_id": "123",
    "completed": false
  }

  const [addTodo] = useMutation<AddTodoData>(ADD_TODO, {
    // refetchQueries: [GET_TODOS]
    update(cache, data) {

      const cachedTodos = cache.readQuery<{ allTodos: Todo[] }>({
        query: GET_TODOS
      })

      if (!cachedTodos) return

      cache.writeQuery({
        query: GET_TODOS,
        data: {
          allTodos: [
            ...cachedTodos?.allTodos,
            data.data?.createTodo
          ]
        }
      })
    }
  })

  const addTodoHandler = () => {
    addTodo({ variables: ADD_TODO_VARIABLES })
  }

  const DELETE_TODO = gql`
      mutation deleteTodo ($id: ID!){
        removeTodo(id:$id){
          id
        }
      }
  `

  const [deleteTodo] = useMutation<DeleteTodoData>(DELETE_TODO,
    {
      update(cache, data) {
        cache.modify<{ allTodos: Array<{ __ref: string }> }>({
            fields: {
              allTodos(currentAllTodos) {
                return currentAllTodos?.filter((todo) => todo.__ref !== `Todo:${data.data?.removeTodo.id}`)
              }
            }
          }
        )

      }
    }
  )

  const deleteTodoHandler = (id: number) => {
    deleteTodo({
      variables: {
        id
      }
    })
  }

  const CHANGE_TODO_STATUS = gql`
    mutation changeTodoStatus ($id: ID!,$completed: Boolean){
      updateTodo (id:$id, completed: $completed) {
      id
      completed
      }
    }
  `

  const [changeTodoStatus] = useMutation<ChangeTodoStatusData>(
    CHANGE_TODO_STATUS
    // ,
    // {
    // update(cache, data) {
    //   const cachedTodos = cache.readQuery<{ allTodos: Todo[] }>({ query: GET_TODOS })
    //   if (!cachedTodos) return
    //   cache.writeQuery({
    //     query: GET_TODOS,
    //     data: {
    //       allTodos: cachedTodos.allTodos.filter(todo => todo.id !== data.data?.removeTodo.id)
    //     }
    //   })
    // }
  )

  const changeTodoStatusHandler = (id: number, completed: boolean) => {
    changeTodoStatus({
      variables: {
        id,
        completed
      }
    })
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error : {error.message}</p>

  return (
    <div>
      <button onClick={addTodoHandler}>add new todo
      </button>
      <ul>
        {data?.allTodos.map((t) =>
          <li key={t.id}>{t.id} - {t.title} - {t.user_id} - <b
            onClick={() => changeTodoStatusHandler(t.id, !t.completed)}>{t.completed.toString()}</b>
            <button style={{ marginLeft: "10px" }} onClick={() => deleteTodoHandler(t.id)}>X
            </button>
          </li>
        )}
      </ul>
    </div>)
}

type GetTodosData = {
  allTodos: Todo[]
}

type AddTodoData = {
  createTodo: Todo
}

type DeleteTodoData = {
  removeTodo: Pick<Todo, "id">
}

type ChangeTodoStatusData = {
  removeTodo: Pick<Todo, "id" | "completed">
}

type Todo = {
  id: number;
  title: string;
  user_id: number;
  completed: boolean;
}

export interface RootObject {
  id: number;
  title: string;
  user_id: number;
  completed: boolean;
}

export default App