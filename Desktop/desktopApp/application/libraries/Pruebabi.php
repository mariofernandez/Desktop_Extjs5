<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pruebabi {
	public function __construct()
    {
    	$this->CI =& get_instance();

    	$this->CI->load->model('pruebadao','',TRUE);
    	
        $this->dao=$this->CI->pruebadao;
    }
	public function consulta()
	{
		$prueba = $this->dao->consulta();
	    return $prueba;
	}
}