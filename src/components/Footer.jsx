import React from "react";

function Footer() {
    return (
        <div className="footer">
            <div className="contact-info row">
                <h1>Contact</h1>
                <div className="col-md-4">
                    <p>Tel: 012-491-2412</p>
                </div>
                <div className="col-md-4">
                    <p>Email: sadas@gmail.com</p>
                </div>
                <div className="col-md-4">
                    <p>Facebook: <a href="flight" target="_blank">www.asfasfasf.com</a></p>
                </div>
                <div>
                    <p className="text-muted">@copyright: 2023 Seongjoon Hong</p>
                </div>
            </div>
        </div>
    )
}

export default Footer;