import React,{useState,useEffect} from 'react';
import './App.css';

function App() {
  const [vacations,setVacations] = useState(null)
  const [place,setPlace] = useState('')
  const [daysOff,setdaysOff] = useState(0)
  const [cool,setCool] = useState(false)
  useEffect(()=>fetch('http://localhost:8000/vacationsList/')
  .then(data=>data.json())
  .then(json=>{
    setVacations(json)
  }),[])

  const createVacation =(e)=>{
    e.preventDefault()
    fetch('http://localhost:8000/vacationsCreate/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        place, 
        days_off:daysOff,
        cool})
    }).then(response=>response.json())
  }

  return (
    <div className="App">
      Hello World
      {vacations?vacations.map(vacation=>(
        <div>
          <div>Place: {vacation.place}</div>
          <div>{vacation.days_off}</div>
        </div>
      )):<>loading...</>}
      <form onSubmit={createVacation}>
        <label>
          place:
          <input value={place} onChange={(e)=>setPlace(e.target.value)}/>
        </label>
        <label>
          days off:
          <input type="number" value={daysOff} onChange={(e)=>setdaysOff(e.target.value)}/>
        </label>
        <label>
          cool:
          <input type="checkbox" checked={cool} onChange={()=>setCool(!cool)}/>
        </label>
        <button>create vacation</button>
      </form>
    </div>
  );
}

export default App;
