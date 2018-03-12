<?php

require_once 'vendor/autoload.php';

use \Slim\Http\Request as Request;
use \Slim\Http\Response as Response;

$app = new \Slim\App;

$app -> add(function(Request $request, Response $response, callable $next){
  // $secanswer = Security::checkSlimAuth($request);
  // if(empty($secanswer)) {             return $response -> withStatus(403, 'Access error.'); }
  // if($secanswer['error'] === true) {  return $response -> withStatus(403, 'Access error.') -> withJson($secanswer); }
  return $next($request, $response);
});

/**
 * /api/alltime/
 */
$app -> get('/api/alltime/', function(Request $request, Response $response, $args) {
  $mongo = new MongoDB\Client();
  $db = $mongo -> wingspan_statistics_new;
  $obj = $db -> summary -> findOne();
  return $response -> withJson($obj);
});
/**
 * /api/year/:year/month/:month/
 */
$app -> get('/api/year/{year:201[0-9]}/month/{month:[0-9]{1,2}}/', function(Request $request, Response $response, $args) {
  $mongo = new MongoDB\Client();
  $db = $mongo -> wingspan_statistics_new;
  $timestamp = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $args['year'] . '-' . $args['month'] . '-01 00:00:00', new DateTimeZone('UTC'));
  $year = (int) $timestamp -> format('Y');
  $month = (int) $timestamp -> format('n');
  $ret = [];
  $ret['leaderboards'] = $db -> leaderboards -> findOne(['_id.date.year' => $year, '_id.date.month' => $month]);
  return $response -> withJson($ret);
});
/**
 * /api/pilots/
 */
$app -> get('/api/pilots/', function(Request $request, Response $response, $args) {
  $mongo = new MongoDB\Client();
  $db = $mongo -> wingspan_statistics_new;
  $obj = $db -> pilots -> find() -> toArray();
  return $response -> withJson($obj);
});

/*
 * Legacy pages
 */
$app -> get('/', function(Request $request, Response $response, $args) {
  require_once 'index-view.html';
});

$app -> run();
