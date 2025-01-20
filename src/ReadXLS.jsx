import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2 } from "@mui/material"
import { Fragment, useState } from "react"
import * as XLSX from "xlsx";

const ReadXLS = () => {
    const [open, setOpen] = useState(false)
    const [files, setFiles] = useState(null)

    const handleFileChange = (e) => {
        setFiles(e.target.files)
    }

    const handleFileUpload = (e) => {
        const file = files[0];

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

                const headers = jsonData[0];

                const requiredHeaders = ["matricule", "nom", "prenom"]

                const isValidHeader = requiredHeaders.every((header) =>
                    headers.includes(header)
                );

                if (!isValidHeader) {
                    console.error("Les en-têtes du fichier Excel ne correspondent pas !");
                    return;
                }

                const rows = jsonData.slice(1);

                const cleanField = (field) => {
                    if (typeof field === "string") {
                      return field.trim() || null; // Supprime les espaces et retourne null si vide
                    }
                    return field !== undefined ? field : null;
                };

                // This is the json Result
                console.log(rows)
            };

            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <Fragment>
            <Grid2 container spacing={2}>
                <Grid2 size={12}>
                    <Button onClick={() => setOpen(true)}>
                        Open Dialog
                    </Button>
                </Grid2>
            </Grid2>
            <Dialog
                open={open}
            >
                <DialogTitle>Importer l'excel</DialogTitle>
                <DialogContent>
                    <input
                        accept=".xlsx, .xls"
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Annuler</Button>
                    <Button onClick={handleFileUpload}>Confirmer</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}

export default ReadXLS