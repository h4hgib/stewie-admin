window.chartColors = {
    dblue   : "#2E62BD",
    orange  : "#FCB712",
    yellow   : "#FFE3A0",
    lblue : "#DAE7FF",
    blue : "#1F4383"
};

var genderConfig = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    35,
                    55,
                    10
                ],
                backgroundColor: [
                    window.chartColors.dblue,
                    window.chartColors.orange,
                    window.chartColors.yellow
                ],
                label: 'Dataset 1'
            }],
            labels: [
                "Male",
                "Female",
                "Unknown"
            ]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Gender'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    },
    ageConfig = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    1,
                    5,
                    15,
                    30,
                    49
                ],
                backgroundColor: [
                    window.chartColors.dblue,
                    window.chartColors.orange,
                    window.chartColors.yellow,
                    window.chartColors.lblue,
                    window.chartColors.blue
                ],
                label: 'Dataset 1'
            }],
            labels: [
                "0-1",
                "2-4",
                "9-12",
                "17",
                "18+"
            ]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Age'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    },
    reasonsPConfig = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    40,
                    30,
                    10,
                    5,
                    5
                ],
                backgroundColor: [
                    window.chartColors.dblue,
                    window.chartColors.orange,
                    window.chartColors.yellow,
                    window.chartColors.lblue,
                    window.chartColors.blue
                ],
                label: 'Dataset 1'
            }],
            labels: [
                "Bullying",
                "Self Harm",
                "Neglect",
                "Health",
                "Domestic Violence"
            ]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Primary Reasons'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    },
    reasonsSConfig = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    40,
                    30,
                    10,
                    5,
                    5
                ],
                backgroundColor: [
                    window.chartColors.dblue,
                    window.chartColors.orange,
                    window.chartColors.yellow,
                    window.chartColors.lblue,
                    window.chartColors.blue
                ],
                label: 'Dataset 1'
            }],
            labels: [
                "Exam Stress",
                "Mental Health",
                "Neglect",
                "Health",
                "Teen Pregnancy"
            ]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Secondary Reasons'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    },
    anonConfig = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    65,
                    35
                ],
                backgroundColor: [
                    window.chartColors.dblue,
                    window.chartColors.orange
                ],
                label: 'Dataset 1'
            }],
            labels: [
                "Anon",
                ""
            ]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Anon Calls'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    },
    callTypeConfig = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    45,
                    25,
                    20,
                    10
                ],
                backgroundColor: [
                    window.chartColors.dblue,
                    window.chartColors.orange,
                    window.chartColors.yellow,
                    window.chartColors.lblue
                ],
                label: 'Dataset 1'
            }],
            labels: [
                "Child",
                "Referral",
                "AA Call",
                "Diverse"
            ]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Call Types'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

window.onload = function() {
    var genderCtx = document.getElementById("gender").getContext("2d");
    window.genderChart = new Chart(genderCtx, genderConfig);

    var ageCtx = document.getElementById("age").getContext("2d");
    window.ageChart = new Chart(ageCtx, ageConfig);

    var reasonsCtx = document.getElementById("reasonsP").getContext("2d");
    window.reasonsChart = new Chart(reasonsCtx, reasonsPConfig);

    var reasonsSCtx = document.getElementById("reasonsS").getContext("2d");
    window.reasonsSChart = new Chart(reasonsSCtx, reasonsSConfig);

    var anonCtx = document.getElementById("anon").getContext("2d");
    window.anonChart = new Chart(anonCtx, anonConfig);

    var callTypeCtx = document.getElementById("callType").getContext("2d");
    window.callTypeChart = new Chart(callTypeCtx, callTypeConfig);
};
