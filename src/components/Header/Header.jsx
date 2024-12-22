import { User } from 'lucide-react'
import React from 'react'

function Header() {

    const getUser = () => {
        
    }
   
  
  
  
    return (
    <>
    <div className="header">
    <nav>
            <ul>
                <h1>User Loged: {"user"}</h1>
                <li><a href="#">Home</a></li>
                <li><a href="#">View Flat</a></li>
                <li><a href="#">Create Flat</a></li>
                <li><a href="#">Profile</a></li>
                <li><a href="#">Logout</a></li>

            </ul>
        </nav>


    </div>
        
    
    
    
    </>
    
    
  )
}

export default Header
