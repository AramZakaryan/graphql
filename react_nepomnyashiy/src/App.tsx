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


import { ApolloCache, gql, useMutation, useQuery } from "@apollo/client"

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

  const [addTodo]
    = useMutation<AddTodoData>(ADD_TODO, {
    // refetchQueries: [GET_TODOS]
    update(cache, data) {

      const cachedTodos = cache.readQuery<{ allTodos: Todo[] }>({
        query: GET_TODOS
      })

      if (!cachedTodos) return

      console.log(cache)

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

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error : {error.message}</p>

  return (
    <div>
      <button onClick={addTodoHandler}>add new todo
      </button>
      <ul>
        {data?.allTodos.map((t) => <li key={t.id}>{t.id} - {t.title} - {t.user_id} - {t.completed.toString()}</li>)}
      </ul>
    </div>)
}

type GetTodosData = {
  allTodos: Todo[]
}

type AddTodoData = {
  createTodo: Todo
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