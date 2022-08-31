/**
 *
 */
//% weight=100 color=190 icon="\uf085"
//% block="FtCalliMicro"
//% groups=['Config','Motor','Servo','Digital Output','Digital Input','Analog Input','Counter Input']
namespace ftcallimicro {
    const FTCALLIMICRO_I2C_ADDRESS = 0x14
	
	const I2C_REG_CONFIG_BASE = 0x00
	const I2C_REG_SERVO_BASE  = 0x10
	const I2C_REG_MOTOR_BASE  = 0x20
	const I2C_REG_DO_BASE     = 0x30
    const I2C_REG_DI_BASE     = 0x40
    const I2C_REG_AI_BASE     = 0x50
	const I2C_REG_CTR_BASE    = 0x60

    /**
     * The user can select voltage or resistor mode of the input channels.
     */
    export enum InputChannelMode {
        //% block="10K-Mode"
        R = 0x00,
		//% block="10V-Mode"
		V = 0x01	
    };
	
	/**
     * The user can select the 8 input channels.
     */
    export enum InputChannel {
        I1 = 0x01,
        I2 = 0x02,
        I3 = 0x04,
        I4 = 0x08,
		I5 = 0x10,
        I6 = 0x20,
        I7 = 0x40,
        I8 = 0x80
    };
	
	/**
     * The user can select counter, digital or ultrasonic of the counter channel 1.
     */
    export enum CounterModeCH1 {
        //% block="Counter"
		CTR = 0x01,
		//% block="DigitalIn"
        DIG = 0x02,
		//% block="Ultrasonic"
        USS = 0x03
    };
	
	/**
     * The user can select counter or digital of the counter channel 2-4.
     */
    export enum CounterModeCH234 {
        //% block="Counter"
		CTR = 0x01,
		//% block="DigitalIn"
        DIG = 0x02
    };
	
	/**
     * The user can select the 4 counter channels.
     */
    export enum CounterChannel {
        C1 = 0x00,
        C2 = 0x01,
        C3 = 0x02,
        C4 = 0x03
    };
	
	/**
     * The user can select the 4 servos.
     */
    export enum Servos {
        S1 = 0x00,
        S2 = 0x01,
        S3 = 0x02,
        S4 = 0x03
    };

    /**
     * The user can select the 4 motors.
     */
    export enum Motors {
        M1 = 0x00,
        M2 = 0x01,
        M3 = 0x02,
        M4 = 0x03
    };
	
	/**
     * The user can select the 8 digital outputs.
     */
    export enum DO {
        DO1 = 0x01,
        DO2 = 0x02,
        DO3 = 0x04,
        DO4 = 0x08,
		DO5 = 0x10,
        DO6 = 0x20,
        DO7 = 0x40,
        DO8 = 0x80
    };
	
	/**
     * The user can select the 8 digital inputs.
     */
    export enum DI {
        DI1 = 0x01,
        DI2 = 0x02,
        DI3 = 0x04,
        DI4 = 0x08,
		DI5 = 0x10,
        DI6 = 0x20,
        DI7 = 0x40,
        DI8 = 0x80
    };
    
    /**
     * The user can select the 8 analog inputs.
     */
    export enum Analog {
        AI1 = 0x00,
        AI2 = 0x01,
        AI3 = 0x02,
        AI4 = 0x03,
		AI5 = 0x04,
        AI6 = 0x05,
        AI7 = 0x06,
        AI8 = 0x07
    };

    /**
     * The user defines the motor rotation direction.
     */
    export enum Dir {
        //% block="CW"
        CW = 1,
        //% block="CCW"
        CCW = -1
    };

    let initialized = false;

    function i2cWrite(addr: number, reg: number, value: number): void {
        let buf = pins.createBuffer(2);
		
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function i2cCmd(addr: number, value: number): void {
        let buf2 = pins.createBuffer(1);
		
        buf2[0] = value;
        pins.i2cWriteBuffer(addr, buf2);
    }

    function i2cReadByte(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return (val);
    }
    
    function i2cReadWord(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt16BE);
        return (val);
    }
	
	/**
	 * Input Channel Configuration.
	 * I1~I8.
    */
    //% weight=100
	//% block="Input 1: %in1|Input 2: %in2|Input 3: %in3|Input 4: %in4|Input 5: %in5|Input 6: %in6|Input 7: %in7|Input 8: %in8"
    //% blockId=InputChannelConfig
	//% in1.defl=InputChannelMode.V in2.defl=InputChannelMode.V in3.defl=InputChannelMode.V in4.defl=InputChannelMode.V in5.defl=InputChannelMode.V in6.defl=InputChannelMode.V in7.defl=InputChannelMode.V in8.defl=InputChannelMode.V
    //% group="Config"
    export function InputChannelConfig(in1: InputChannelMode,
									   in2: InputChannelMode,
									   in3: InputChannelMode,
									   in4: InputChannelMode,
									   in5: InputChannelMode,
									   in6: InputChannelMode,
									   in7: InputChannelMode,
									   in8: InputChannelMode): void {
		let input_mode_select = 0;
		
		input_mode_select = in1 + (in2 << 1) + (in3 << 2) + (in4 << 3) + (in5 << 4) + (in6 << 5) + (in7 << 6) + (in8 << 7);
			
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_CONFIG_BASE + 1, input_mode_select);
    }
	
	/**
	 * Counter Channel Configuration.
	 * C1~C4.
    */
    //% weight=90
	//% block="Counter 1: %in1|Counter 2: %in2|Counter 3: %in3|Counter 4: %in4"
    //% blockId=CounterChannelConfig
	//% in1.defl=CounterModeCH1.CTR in2.defl=CounterModeCH234.CTR in3.defl=CounterModeCH234.CTR in4.defl=CounterModeCH234.CTR
    //% group="Config"
    export function CounterChannelConfig(in1: CounterModeCH1,
									     in2: CounterModeCH234,
									     in3: CounterModeCH234,
									     in4: CounterModeCH234): void {
		let counter_mode_select = 0;
		
		counter_mode_select = in1 + (in2 << 2) + (in3 << 4) + (in4 << 6);
		
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_CONFIG_BASE + 2, counter_mode_select);
    }
	

    /**
	 * Servo control function.
     * S1~S4.
     * 0°~180°.
	*/
	//% weight=100
    //% block="Servo|%index|degree|%degree|°"
	//% blockId=Servo
	//% index.fieldEditor="gridpicker" index.fieldOptions.columns=4
    //% degree.min=0 degree.max=180
    //% degree.shadow="protractorPicker"
    //% group="Servo"
    export function Servo(index: Servos, degree: number): void {
        /* Limit degree to valid range */
        if (degree < 0) {
            degree = 0;
        }
        
        if (degree > 180) {
            degree = 180;
        }
        
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_SERVO_BASE + index, degree);
    }
	
	/**
	 * Motor control function: Set motor speed
     * M1~M4.
     * speed: 0~100
    */
    //% weight=100
	//% block="Motor|%index|dir|%Dir|speed|%speed|%"
    //% blockId=MotorRun
	//% index.fieldEditor="gridpicker" index.fieldOptions.columns=4
	//% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    //% speed.min=0 speed.max=100
    //% group="Motor"
    export function MotorRun(index: Motors, direction: Dir, speed: number): void {
        /* Limit speed to valid range */
        if (speed < 0) {
            speed = 0;
        }
        
        if (speed > 100) {
            speed = 100;
        }
        
        i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_MOTOR_BASE + index, speed * direction);
    }
	
	/**
	 * Motor control function: Stop the motor.
	 * M1~M4.
    */
    //% weight=90
	//% block="Motor Stop|%index"
    //% blockId=MotorStop 
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=4 
    //% group="Motor"
    export function MotorStop(index: Motors): void {
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_MOTOR_BASE + index, 0);
    }

    /**
	 * Motor control function: Stop all motors
    */
    //% weight=85
	//% block="Motor Stop All"
    //% blockId=MotorStopAll 
    //% group="Motor"
    export function MotorStopAll(): void {
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_MOTOR_BASE + Motors.M1, 0);
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_MOTOR_BASE + Motors.M2, 0);
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_MOTOR_BASE + Motors.M3, 0);
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_MOTOR_BASE + Motors.M4, 0);
    }
	
	/**
	 * Digital Output control function: ON.
	 * DO1~DO8.
    */
    //% weight=100
	//% block="Output ON|%index"
    //% blockId=DigitalOutputOn
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=8
    //% group="Digital Output"
    export function DigitalOutputOn(index: DO): void {
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_DO_BASE, index);
    }
	
	/**
	 * Digital Output control function: OFF.
	 * DO1~DO8.
    */
    //% weight=90
	//% block="Output OFF|%index"
    //% blockId=DigitalOutputOff
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=8
    //% group="Digital Output"
    export function DigitalOutputOff(index: DO): void {
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_DO_BASE + 1, index);
    }
    
    /**
	 * Digital Input control function.
	 * DI1~DI8.
    */
    //% weight=100
	//% block="Input |%index"
    //% blockId=DigitalInput
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=8
    //% group="Digital Input"
    export function DigitalInput(index: DI): boolean {
		let callimicro_di_value = i2cReadByte(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_DI_BASE);
        
        if (callimicro_di_value & index)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    
    /**
	 * Analog Input control function.
	 * AI1~AI8.
    */
    //% weight=100
	//% block="Input |%index"
    //% blockId=AnalogInput
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=8
    //% group="Analog Input"
    export function AnalogInput(index: Analog): number {
		let callimicro_ai_value = i2cReadWord(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_AI_BASE + index);
        
        return callimicro_ai_value;
    }

}