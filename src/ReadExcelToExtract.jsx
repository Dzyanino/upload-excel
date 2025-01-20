import { Fragment, useState } from "react";
import * as XLSX from "xlsx";

const ExcelColumnExtractor = () => {
    const [columns, setColumns] = useState([]);
    const handleFileUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                });

                if (jsonData.length > 0) {
                    setColumns(jsonData[0]);
                }
            };

            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <Fragment>
            <div>
                <h1>Excel column Extractor</h1>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                />
                {columns.length > 0 && (
                    <div>
                        <h2>Column Names :</h2>

                        <ul>
                            {columns.map((col, index) => (
                                <li key={index}>{col}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default ExcelColumnExtractor;
