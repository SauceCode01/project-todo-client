import React, { useEffect } from 'react'

const App = () => {

  useEffect(() => {
    const fetchData = async () => {
      const url = "http://localhost:5000/api/users"
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
    }
    fetchData();
    
  }, [])

  return (
    <div>App</div>
  )
}

export default App