<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Willkommen bei Autagram</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #0a0a0a;
            color: #ffffff;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%);
            border-radius: 20px;
            border: 1px solid rgba(139, 0, 0, 0.3);
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        .header {
            background: linear-gradient(135deg, #8b0000 0%, #4a0000 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 42px;
            color: #ffffff;
            letter-spacing: -0.02em;
            text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.8);
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #ffffff;
            font-size: 24px;
            margin: 0 0 20px 0;
        }
        .content p {
            color: #c0c0c0;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 15px 0;
        }
        .features {
            background-color: rgba(139, 0, 0, 0.1);
            border: 1px solid rgba(139, 0, 0, 0.3);
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
        }
        .features h3 {
            color: #ff6b6b;
            font-size: 18px;
            margin: 0 0 15px 0;
        }
        .features ul {
            margin: 0;
            padding: 0 0 0 20px;
            color: #c0c0c0;
        }
        .features li {
            margin-bottom: 10px;
            line-height: 1.5;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #8b0000 0%, #4a0000 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 10px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(139, 0, 0, 0.3);
        }
        .footer {
            background-color: rgba(10, 10, 10, 0.8);
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid rgba(139, 0, 0, 0.2);
        }
        .footer p {
            color: #808080;
            font-size: 14px;
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Autagram</h1>
            <p>Soziale Plattform für Autisten</p>
        </div>
        
        <div class="content">
            <h2>Willkommen, {{ $user->name }}! 🎉</h2>
            
            <p>Wir freuen uns sehr, dass du Teil der Autagram-Community geworden bist!</p>
            
            <p>Autagram ist eine soziale Plattform, die speziell für Menschen im Autismus-Spektrum entwickelt wurde. Hier kannst du dich in einer sicheren und verständnisvollen Umgebung ausdrücken.</p>
            
            <div class="features">
                <h3>Was dich erwartet:</h3>
                <ul>
                    <li><strong>Reizarme Oberfläche:</strong> Dunkles Design ohne ablenkende Elemente</li>
                    <li><strong>Trigger-Verwaltung:</strong> Teile mit, was dich triggert oder reizüberflutet</li>
                    <li><strong>Emoji-Reaktionen:</strong> Drücke deine Gefühle mit 5 verschiedenen Reaktionen aus</li>
                    <li><strong>Sichere Community:</strong> Admins überwachen die Plattform für deine Sicherheit</li>
                    <li><strong>Profil-Anpassung:</strong> Entscheide selbst, was du öffentlich teilen möchtest</li>
                </ul>
            </div>
            
            <p>Dein Account wurde erfolgreich erstellt mit:</p>
            <p><strong>Benutzername:</strong> {{ $user->username }}<br>
            <strong>E-Mail:</strong> {{ $user->email }}</p>
            
            <center>
                <a href="http://localhost:3000/feed" class="button">Zur Plattform</a>
            </center>
            
            <p>Falls du Fragen hast oder Hilfe benötigst, zögere nicht, uns zu kontaktieren.</p>
        </div>
        
        <div class="footer">
            <p><strong>Autagram Team</strong></p>
            <p>Diese E-Mail wurde automatisch generiert. Bitte antworte nicht auf diese E-Mail.</p>
            <p>&copy; 2025 Autagram. Alle Rechte vorbehalten.</p>
        </div>
    </div>
</body>
</html>

