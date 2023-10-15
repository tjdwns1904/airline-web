import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import { Card } from "react-bootstrap";

function Flight(props) {
    const navigate = useNavigate();
    let pageSize = 5;
    function getDetails(id) {
        navigate("/flightDetail", { state: id })
    }
    const [flights, setFlights] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * pageSize;
        const lastPageIndex = firstPageIndex + pageSize;
        return flights.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, flights]);
    console.log(currentTableData);
    async function getFlights() {
        await fetch("http://localhost:8080/flight", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(res => {
                setFlights(res);
            })
    };
    useEffect(() => {
        getFlights();
    }, []);
    return (
        <div>
            <Header login={props.isLoggedIn} isAdmin={props.isAdmin} />
            <div className="background">
                {currentTableData.map((flight) => {
                    const price = flight.price;
                    return (
                        <Card className="flight-table col-md-6" key={flight.id} onClick={() => {
                            getDetails(flight.id)
                        }}>
                            <p className="table-title">{flight.flightNumber}</p>
                            <div className="table-items">
                                <ul className="flight-detail">
                                    <li>{flight.dCity}</li>
                                    <li>({flight.dTime.slice(9, 14)})</li>
                                </ul>
                                <div className="line"></div>
                                <ul className="flight-detail">
                                    <li>{flight.aCity}</li>
                                    <li>({flight.aTime.slice(9, 14)})</li>
                                </ul>
                                <div className="price">{price.toLocaleString("en-US")} VND</div>
                            </div>
                        </Card>
                    );
                })}
                <Pagination onPageChange={page => setCurrentPage(page)} currentPage={currentPage} pageSize={pageSize} totalCount={flights.length} />
            </div>
            <Footer />
        </div>
    )
}

export default Flight;