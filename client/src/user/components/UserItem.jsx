import { Link, useNavigate } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";
import Avatar from "../../shared/components/UIElements/Avatar";
import "./UserItem.css";

const UserItem = ({ id, name, image, placeCount }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/${id}/places`);
  }
  return (
    <li className="user-item" onClick={handleClick}>
      <Card className="user-item__content">
        <Link to={`/${id}/places`}>
          <div className="user-item__image">
            <Avatar image={image} alt={name} />
          </div>
          <div className="user-item__info">
            <h2>{name}</h2>
            <h3>
              {placeCount} {placeCount === 1 ? "place" : "places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
