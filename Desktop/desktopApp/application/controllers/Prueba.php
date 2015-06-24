<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Prueba extends CI_Controller {
	public function __construct()
    {
    	parent::__construct();

    	$this->load->library('pruebabi');
        $this->bi = $this->pruebabi;	
    }
	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see http://codeigniter.com/user_guide/general/urls.html
	 */
	function consulta()
	{
		$resultado = $this->bi->consulta();
        echo $this->getSuccess( array ("success" =>  "true" , "numFilas" => count($resultado), "data"=> $resultado ) );
	}
	function getSuccess($arr){
        if(!isset($arr["success"]))
    	    $arr["success"]=true;
    	return json_encode($arr);
    }
}
