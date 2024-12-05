// backend in node

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const readline = require('readline');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());


app.get('/api/pincode/:pincode', async (req, res) => {
    try {
        const { pincode } = req.params;
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        
        if (response.data[0].Status === 'Success') {
            const simplifiedData = response.data[0].PostOffice
                .slice(0, 2)
                .map(office => ({
                    name: office.Name,
                    state: office.State
                }));
            res.json({
                success: true,
                data: simplifiedData
            });
        } else {
            res.json({
                success: false,
                message: 'No postal data found for this PIN code'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching postal data',
            error: error.message
        });
    }
});


async function getPincodeData(pincode) {
    try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        
        if (response.data[0].Status === 'Success') {
            const simplifiedData = response.data[0].PostOffice
                .slice(0, 2)
                .map(office => ({
                    name: office.Name,
                    state: office.State
                }));
            return {
                success: true,
                data: simplifiedData
            };
        } else {
            return {
                success: false,
                message: 'No postal data found for this PIN code'
            };
        }
    } catch (error) {
        return {
            success: false,
            message: 'Error fetching postal data',
            error: error.message
        };
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askPincode() {
    rl.question('Enter pincode (or type "exit" to quit): ', async (pincode) => {
        if (pincode.toLowerCase() === 'exit') {
            rl.close();
            return;
        }

        const result = await getPincodeData(pincode);
        if (result.success) {
            result.data.forEach((office, index) => {
                console.log(`Place ${index + 1}: ${office.name}, ${office.state}`);
            });
        } else {
            console.log(result.message);
        }
        
        askPincode(); 
    });
}

askPincode();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

