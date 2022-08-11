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
        S1 = 0x01,
        S2 = 0x02,
        S3 = 0x03,
        S4 = 0x04
    }

    /**
     * The user selects the 4 motors.
     */
    export enum Motors {
        M1 = 0x01,
        M2 = 0x02,
        M3 = 0x03,
        M4 = 0x04
    }
	
	/**
     * The user selects the 8 digital outputs.
     */
    export enum DO {
        DO1 = 0x01,
        DO2 = 0x02,
        DO3 = 0x03,
        DO4 = 0x04,
		DO5 = 0x05,
        DO6 = 0x06,
        DO7 = 0x07,
        DO8 = 0x08
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

    let initialized = false

    function i2cWrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cCmd(addr: number, value: number) {
        let buf2 = pins.createBuffer(1)
        buf2[0] = value
        pins.i2cWriteBuffer(addr, buf2)
    }

    function i2cRead(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE)
        return val
    }

    /**
	 * Servo control function.
     * S1~S4.
     * 0°~180°.
	*/
    //% block="Servo|%index|degree|%degree|°"
    //% weight=100
    //% degree.min=0 degree.max=180
    //% degree.shadow="protractorPicker"
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=4
    //% group="Servo"
    export function servo(index: Servos, degree: number): void {

        let value = (degree * 2000 / 180 + 2000)

        i2cWrite(FTCALLIMICRO_I2C_ADDRESS, I2C_REG_SERVO_BASE + index, value)
    }

}