const verificationEmailTemplate = (firstName, code) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification de votre compte MédiConnect</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4a90e2;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 0 0 5px 5px;
        }
        .code {
            background-color: #f8f9fa;
            padding: 15px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 5px;
            margin: 20px 0;
            border-radius: 5px;
            color: #4a90e2;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4a90e2;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MédiConnect</h1>
        </div>
        <div class="content">
            <h2>Bonjour ${firstName},</h2>
            
            <p>Merci d'avoir choisi MédiConnect pour gérer vos rendez-vous médicaux. Pour finaliser votre inscription et accéder à votre espace personnel, veuillez utiliser le code de vérification ci-dessous :</p>
            
            <div class="code">A9Y3N5</div>
            
            <p>Ce code est valable pendant 5 minutes. Si vous n'avez pas demandé cette vérification, veuillez ignorer cet email.</p>
            
            <p>Pour des raisons de sécurité, ne partagez jamais ce code avec personne.</p>
            
            <p>Si vous rencontrez des difficultés, n'hésitez pas à contacter notre service client.</p>
            
            <p>Cordialement,<br>L'équipe MédiConnect</p>
        </div>
        <div class="footer">
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            <p>© 2024 MédiConnect - Tous droits réservés</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = verificationEmailTemplate; 