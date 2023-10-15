import React, { useEffect, useMemo, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import { Card } from "react-bootstrap";

function Booking(props) {
    const pageSize = 1;
    const [flights, setFlights] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    function getDetails(id) {
        navigate("/flightDetail", { state: id })
    }
    const uid = localStorage.getItem('user');
    const url = "http://localhost:8080/history?user_id=" + uid;
    async function getBook() {
        await fetch(url, {
            method: "GET",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(res => {
                setFlights(res);
                console.log(res);
            });
    }
    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * pageSize;
        const lastPageIndex = firstPageIndex + pageSize;
        return flights.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, flights]);
    useEffect(() => {
        getBook();
    }, []);

    if (flights.length > 0) {
        return (
            <div>
                <Header login={props.isLoggedIn} isAdmin={props.isAdmin} />
                <div className="background">
                    {currentTableData.map((flight) => {
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
                                </div>
                            </Card>
                        );
                    })}
                    <Pagination onPageChange={setCurrentPage} totalCount={flights.length} pageSize={pageSize} currentPage={currentPage} />
                </div>
                <Footer />
            </div>
        )
    } else {
        return (
            <div>
                <Header login={props.isLoggedIn} />
                <div className="background">
                    <div className="nothing col-sm-6">
                        <h1>No Flight Booked</h1>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default Booking;