const queryValue = `
query getTodos {
  todos {
    data{
      id
      title
    }
  }
}
`

fetch("https://graphqlzero.almansi.me/api",
    {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query: queryValue}),
    })
    .then(response => response.json())
    .then(data => console.log(data.data.todos.data))

// const queryValue = `
// mutation changeStatus ($id:ID!, $input: UpdateTodoInput!) {
//   updateTodo (id:$id, input:$input){
//   title
//   }
// }
// `
// const variablesValue = {
//     id: 1,
//     input: {title: "new title"}
//
// }
//
//
// fetch("https://graphqlzero.almansi.me/api",
//     {
//         method: "POST",
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({
//             query: queryValue,
//             variables: variablesValue
//         }),
//
//     })
//     .then(response => response.json())
//     .then(data => console.log(data.data.updateTodo.title))


// const queryValue = `
// mutation addTodo ($input:CreateTodoInput!){
//   createTodo (input:$input){
//     id
//   }
// }
// `
// const variablesValue = {
//     "input": {"title": "new todo title", "completed": false}
// }
//
//
// fetch("https://graphqlzero.almansi.me/api",
//     {
//         method: "POST",
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({
//             query: queryValue,
//             variables: variablesValue
//         }),
//
//     })
//     .then(response => response.json())
//     .then(data => console.log(data))

