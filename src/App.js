import React,{useState,useEffect} from 'react';
import './App.css';

function App() {
  const [vacations,setVacations] = useState(null)
  const [activities,setActivities] = useState(null)
  const [place,setPlace] = useState('')
  const [daysOff,setdaysOff] = useState(0)
  const [cool,setCool] = useState(false)
  const [vacationEditArray,setVacationEditArray] = useState(null);
  const [activitiesEditArray,setActivitiesEditArray] = useState(null);
  let activitiesCount = 0
  let nestedACount=[]
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
    setActivitiesEditArray(json.map(activity=>{
      return{
        ...activity
      }
    }))
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

  const updateActivities =(id,name,description,vacationId)=>{
    fetch(`http://localhost:8000/activitiesUpdate/${id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name, 
        description,
        vacation:vacationId})
    }).then(response=>response.json())
    .then(json=>{
      const index = activities.findIndex(obj=>obj.id===json.id)
      const activitiesCopy = [...activities]
      activitiesCopy[index] = json
      setActivities(activitiesCopy)
    })
  }

  return (
    <div className="App">
      Hello World
      {activitiesCount=0}
      {nestedACount=[]}
      {vacations?vacations.map((vacation,idx)=>(
        <div>
          <div>Place: {vacation.place}</div>
          <div>{vacation.days_off}</div>
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
            setVacationEditArray(vacationEditArrayCopy)
            }}/>
            <button>update vacation</button>
          </form>
          {nestedACount.push([])}
          {activities?activities.filter(activity=>activity.vacation.vacation_id===vacation.vacation_id).map((activity,actIdx)=>{
            nestedACount[idx].push(activitiesCount)
            activitiesCount++
            return(
              <div>
                <div>{activity.name}</div>
                <div>{activity.description}</div>
                <div>{activity.vacation.place}</div>
                <div>activities count{activitiesCount}</div>
                <form onSubmit={(e)=>{
                  e.preventDefault()
                  updateActivities(activitiesEditArray[nestedACount[idx][actIdx]].id,activitiesEditArray[nestedACount[idx][actIdx]].name,activitiesEditArray[nestedACount[idx][actIdx]].description,activitiesEditArray[nestedACount[idx][actIdx]].vacation.vacation_id)
                }}>
                  name: <input value={activitiesEditArray[nestedACount[idx][actIdx]].name} onChange={(e)=>{
                    const activitiesEditArrayCopy = [...activitiesEditArray]
                    console.log('acrray1',activitiesEditArray[nestedACount[idx][actIdx]].name)
                    activitiesEditArrayCopy[nestedACount[idx][actIdx]].name = e.target.value
                    console.log('acrray',activitiesEditArrayCopy[nestedACount[idx][actIdx]].name)
                    console.log(activitiesEditArray[nestedACount[idx][actIdx]].name)
                    setActivitiesEditArray(activitiesEditArrayCopy)
                    }}/>
                  description: <input value={activitiesEditArray[nestedACount[idx][actIdx]].description} onChange={(e)=>{
                    const activitiesEditArrayCopy = [...activitiesEditArray]
                    activitiesEditArrayCopy[nestedACount[idx][actIdx]].days_off = e.target.value
                    setActivitiesEditArray(activitiesEditArrayCopy)
                    }}/>
                  vacation id:
                  <select value={activitiesEditArray[nestedACount[idx][actIdx]].vacation.vacation_id} onChange={(e)=>{
                    const activitiesEditArrayCopy = [...activitiesEditArray]
                    activitiesEditArrayCopy[nestedACount[idx][actIdx]].vacation.vacation_id = e.target.value
                    setActivitiesEditArray(activitiesEditArrayCopy)
                    }}>   
                          {vacations.map(v=>{
                            return <option value={v.vacation_id}>
                              {v.place}
                            </option>
                          })}         
                  </select>
                  <button>update activity</button>
                </form>
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
