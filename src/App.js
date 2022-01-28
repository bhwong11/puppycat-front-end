import React,{useState,useEffect} from 'react';
import './App.css';

function App() {
  const [vacations,setVacations] = useState(null)
  const [activities,setActivities] = useState(null)
  const [place,setPlace] = useState('')
  const [daysOff,setdaysOff] = useState(0)
  const [cool,setCool] = useState(false)
  const [vacationEditArray,setVacationEditArray] = useState(null);
  useEffect(()=>{
  
  fetch('http://localhost:8000/vacationsList/')
  .then(data=>data.json())
  .then(json=>{
    setVacationEditArray(json.map(vacation=>{
      return {...vacation}
    }))
    setVacations(json)
  })

  fetch('http://localhost:8000/activitiesList/')
  .then(data=>data.json())
  .then(json=>{
    setActivities(json)
  })

},[])

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
    .then(json=>{
      setVacations([...vacations,json])
    })
  }

  const updateVacation =(id,place,days_off,cool)=>{
    fetch(`http://localhost:8000/vacationsUpdate/${id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        place, 
        days_off,
        cool})
    }).then(response=>response.json())
    .then(json=>{
      const index = vacations.findIndex(obj=>obj.vacation_id===json.vacation_id)
      const vacationsCopy = [...vacations]
      vacationsCopy[index] = json
      setVacations(vacationsCopy)
    })
  }

  return (
    <div className="App">
      Hello World
      {vacations?vacations.map((vacation,idx)=>(
        <div>
          <div>Place: {vacation.place}</div>
          <div>{vacation.days_off}</div>
          {console.log(vacationEditArray)}
          <form onSubmit={(e)=>{
            e.preventDefault()
            updateVacation(vacationEditArray[idx].vacation_id,vacationEditArray[idx].place,vacationEditArray[idx].days_off,vacationEditArray[idx].cool)
          }}>
            place: <input value={vacationEditArray[idx].place} onChange={(e)=>{
              const vacationEditArrayCopy = [...vacationEditArray]
              vacationEditArrayCopy[idx].place = e.target.value
              setVacationEditArray(vacationEditArrayCopy)
              }}/>
            days off: <input type="number" value={vacationEditArray[idx].days_off} onChange={(e)=>{
              const vacationEditArrayCopy = [...vacationEditArray]
              vacationEditArrayCopy[idx].days_off = e.target.value
              setVacationEditArray(vacationEditArrayCopy)
              }}/>
          cool: <input type="checkbox" checked={vacationEditArray[idx].cool} onChange={()=>{
            const vacationEditArrayCopy = [...vacationEditArray]
            vacationEditArrayCopy[idx].days_off = !vacationEditArrayCopy[idx].days_off
            setVacationEditArray(vacationEditArrayCopy[idx])
            }}/>
            <button>update vacation</button>
          </form>
          {activities?activities.filter(activity=>activity.vacation.vacation_id===vacation.vacation_id).map(activity=>{
            return(
              <div>
                <div>{activity.name}</div>
                <div>{activity.description}</div>
              </div>
            )
          }):<>loading activities...</>}
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
