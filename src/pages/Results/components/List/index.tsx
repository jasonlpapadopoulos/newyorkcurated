interface ListProps {
  restaurants: any[];
}

export default function List({ restaurants }: ListProps) {
  return (
    <div className="restaurant-list">
      {restaurants.map(restaurant => (
        <div key={restaurant.id} className="restaurant-card">
          <img 
            src={restaurant.imageUrl} 
            alt={restaurant.name}
            className="restaurant-image"
          />
          <div className="restaurant-info">
            <h3>{restaurant.name}</h3>
            <p className="restaurant-meta">
              {restaurant.cuisine} · {restaurant.price}
            </p>
            <p className="restaurant-description">
              {restaurant.description}
            </p>
            <p className="restaurant-address">
              {restaurant.address}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}