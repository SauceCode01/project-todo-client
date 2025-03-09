import React, { useEffect } from 'react'

const App = () => {

  useEffect(() => {
    const fetchData = async () => {
      const url = "https://project-todo-api.onrender.com/api/users"
      console.log("fetching from: ", url)
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log("this is the result", json);
      } catch (error) {
        console.error(error.message);
      }

      console.log("fetching complete")
    }
    fetchData();
    
  }, [])

  return (
    <div>App</div>
  )
}

export default App