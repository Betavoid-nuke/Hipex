interface props{
    name: string
}

export default function MagicButton({name}: props) {

    return(
        <button className="btn" type="button">
            <strong>{name}</strong>
            <div id="container-stars">
              <div id="stars"></div>
            </div>
            <div id="glow">
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          </button>
    )
}