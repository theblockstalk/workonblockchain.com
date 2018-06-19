function synapseThrow() {

  angular.module('uploads').controller('UploaderController',
  ['$scope', '$stateParams', '$location', 'Authentication', 'FileUploader', '_',
    function ($scope, $stateParams, $location, Authentication, FileUploader, _) {
      $scope.authentication = Authentication;
      
      /** uploader **/
      $scope.done = false;
      var uploader = $scope.uploader = new FileUploader({
        autoUpload: true,
        url: '/api/teams/logo',
        alias: 'photo',
        queueLimit: 1,
        removeAfterUpload: true
      });

      uploader.onErrorItem = function (fileItem, response, status, headers) {
        $scope.message = {type: 'error', title: 'Error', message: response.message};
      };

      uploader.onSuccessItem = function (fileItem, response, status, headers) {
        $scope.team.logo = response;
        $scope.image = response;
      };

      uploader.onCompleteAll = function () {
        $scope.done = true;
        $scope.message = null;
      };


    }
  ]);
}