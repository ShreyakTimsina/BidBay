import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";

const product = ({ product }) => {
	return (
		<Card className="productCard" style={{ height: "100%" }}>
			<Link to={`/product/${product._id}`}>
				<Card.Img
					src={product.image}
					variant="top"
					className="productImage"
				/>
			</Link>

			<Card.Body style={{ padding: "16px" }}>
				<Link to={`/product/${product._id}`} className="productTitle">
					<Typography variant="h6" component="div">
						{product.name}
					</Typography>
				</Link>
				<Card.Text
					style={{
						color: "#f85606",
						fontSize: "18px",
						fontWeight: "600",
					}}
				>
					Rs {product.price}
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default product;
