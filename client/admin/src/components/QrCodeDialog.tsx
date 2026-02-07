import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import { useRef } from "react"
import { Printer } from "lucide-react"

interface QrCodeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    batchId: string;
    productName: string;
}

export function QrCodeDialog({ isOpen, onClose, batchId, productName }: QrCodeDialogProps) {
    const verificationUrl = `${process.env.NEXT_PUBLIC_TRACE_URL}/verify/${batchId}`;
    const qrRef = useRef<SVGSVGElement>(null);

    const handlePrint = () => {
        const printWindow = window.open('', '', 'width=600,height=600');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print QR Code - ${batchId}</title>
                        <style>
                            body {
                                font-family: sans-serif;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                height: 100vh;
                                margin: 0;
                            }
                            .container {
                                text-align: center;
                                padding: 20px;
                                border: 2px solid #000;
                                border-radius: 10px;
                            }
                            h2 { margin-bottom: 10px; }
                            p { color: #666; margin-top: 5px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>${productName}</h2>
                            ${qrRef.current?.outerHTML}
                            <p>Batch ID: ${batchId}</p>
                            <p>Scan to Verify</p>
                        </div>
                        <script>
                            window.onload = function() { window.print(); window.close(); }
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Batch QR Code</DialogTitle>
                    <DialogDescription>
                        Scan this code to verify the batch details and supply chain history.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                    <div className="p-4 border rounded-lg bg-white">
                        <QRCodeSVG
                            ref={qrRef}
                            value={verificationUrl}
                            size={200}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="font-semibold text-lg">{productName}</p>
                        <p className="text-sm text-gray-500 font-mono">{batchId}</p>
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print QR
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
