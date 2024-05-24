import Avatar from "../../shared/components/UIElements/Avatar"

const UserItem = ({name, image, placeCount}) => {
  return (
    <li className="user-item">
      <div className="user-item_content">
        <div className="user-item_image">
           <Avatar image={image} alt={name} />
        </div>
        <div className="user-item_info">
          <h2>{name}</h2>
          <h3>{placeCount} {placeCount === 1 ? 'place' : 'places'}</h3>
        </div>          
      </div>
    </li>
  )
}

export default UserItem
