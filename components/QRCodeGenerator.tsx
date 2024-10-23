"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import QRCode from 'qrcode.react';

export default function QRCodeGenerator({ profileUrl }) {
  const [qrVisible, setQrVisible] = useState(false);

  const toggleQRCode = () => {
    setQrVisible(!qrVisible);
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    let downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'qr-code.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="mt-4">
      <Button onClick={toggleQRCode}>
        {qrVisible ? 'Ocultar Código QR' : 'Generar Código QR'}
      </Button>
      {qrVisible && (
        <div className="mt-4">
          <QRCode
            id="qr-code"
            value={`https://tu-dominio.com/${profileUrl}`}
            size={256}
            level="H"
          />
          <Button onClick={downloadQRCode} className="mt-2">
            Descargar Código QR
          </Button>
        </div>
      )}
    </div>
  );
}