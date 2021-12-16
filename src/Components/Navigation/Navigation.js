import React from 'react';



const Navigation = ({onRouteChange,isSingedIn}) => {

    if(isSingedIn)
    {
        return(
            <nav style={{display: 'flex',justifyContent:'flex-end'}}>
                <p onClick={() => onRouteChange('SignOut')} className='f3 link dim blank underline pa3 pointer'>Sign Out</p>
            </nav> 
        );
    }
    else
    {
        return(
            <div>
                <nav style={{display: 'flex',justifyContent:'flex-end'}}>
                    <p onClick={() => onRouteChange('SignIn')} className='f3 link dim blank underline pa3 pointer'>Sign In</p>
                    <p onClick={() => onRouteChange('Register')} className='f3 link dim blank underline pa3 pointer'>Register</p>
                </nav>
            </div>
        );

    }


}

export default Navigation;