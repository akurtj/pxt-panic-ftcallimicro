/**
 */
//% weight=100 color=190 icon="\uf085"
//% block="FtCalliMicro"
//% groups=['Motor','Servo','Digital Output']
namespace ftcallimicro {
    const FTCALLIMICRO_I2C_ADDRESS = 0x14
	
	const I2C_REG_CONFIG_BASE = 0x00
	const I2C_REG_SERVO_BASE  = 0x10
	const I2C_REG_MOTOR_BASE  = 0x20
	const I2C_REG_DO_BASE     = 0x30

    /**
     * The user can select the 4 servos.
     */
    export enum Servos {
        S1 = 0x00,
        S2 = 0x01,
        S3 = 0x02,
        S4 = 0x03
    }

    /**
     * The user selects the 4 motors.
     */
    export enum Motors {
        M1 = 0x00,
        M2 = 0x01,
        M3 = 0x02,
        M4 = 0x03
    }
	
	/**
     * The user selects the 8 digital outputs.
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
    }

    /**
     * The user defines the motor rotation direction.
     */
    export enum Dir {
        //% blockId="CW" block="CW"
        CW = 1,
        //% blockId="CCW" block="CCW"
        CCW = -1
    }

    let initialized = false;

    function i2cWrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2);
		
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function i2cCmd(addr: number, value: number) {
        let buf2 = pins.createBuffer(1);
		
        buf2[0] = value;
        pins.i2cWriteBuffer(addr, buf2);
    }

    function i2cRead(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return (val);
    }
	

    /**
	 * Servo control function.
     * S1~S4.
     * 0°~180°.
	*/
	//% weight=100
    //% block="Servo|%index|degree|%degree|°"
	//% blockId=servo_servo
	//% index.fieldEditor="gridpicker" index.fieldOptions.columns=4
    //% degree.min=0 degree.max=180
    //% degree.shadow="protractorPicker"
    //% group="Servo"
    export function servo(index: Servos, degree: number): void {
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_SERVO_BASE + index, degree);
    }
	
	/**
	 * Motor control function: Set motor speed
     * M1~M4.
     * speed: 0~100
    */
    //% weight=100
	//% block="Motor|%index|dir|%Dir|speed|%speed|%"
    //% blockId=motor_MotorRun
	//% index.fieldEditor="gridpicker" index.fieldOptions.columns=4
	//% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    //% speed.min=0 speed.max=100
    //% speed.shadow="turnRatioPicker"
    //% group="Motor"
    export function MotorRun(index: Motors, direction: Dir, speed: number): void {
        i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_MOTOR_BASE + index, speed * Dir);
    }
	
	/**
	 * Motor control function: Stop the motor.
	 * M1~M4.
    */
    //% weight=90
	//% block="Motor Stop|%index"
    //% blockId=motor_MotorStop 
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=4 
    //% group="Motor"
    export function MotorStop(index: Motors) {
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_MOTOR_BASE + index, 0);
    }

    /**
	 * Motor control function: Stop all motors
    */
    //% weight=85
	//% block="Motor Stop All"
    //% blockId=motor_MotorStopAll 
    //% group="Motor"
    export function MotorStopAll(): void {
        
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_MOTOR_BASE + M1, 0);
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_MOTOR_BASE + M2, 0);
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_MOTOR_BASE + M3, 0);
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_MOTOR_BASE + M4, 0);
    }
	
	/**
	 * Digital Output control function: ON.
	 * DO1~DO8.
    */
    //% weight=100
	//% block="Output ON|%index"
    //% blockId=digitalout_DigitalOutputOn
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=8
    //% group="Digital Output"
    export function DigitalOutputOn(index: DO) {
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_DO_BASE, index);
    }
	
	/**
	 * Digital Output control function: OFF.
	 * DO1~DO8.
    */
    //% weight=90
	//% block="Output OFF|%index"
    //% blockId=digitalout_DigitalOutputOff
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=8
    //% group="Digital Output"
    export function DigitalOutputOff(index: DO) {
		i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_DO_BASE + 1, index);
    }

}