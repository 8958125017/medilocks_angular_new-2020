import { Component, OnInit } from '@angular/core';
import { times } from 'underscore';
import { ToastrService } from 'ngx-toastr';
import { ApiIntegrationService } from '../api-integration.service';
declare var $: any;
@Component({
    selector: 'app-mycalander',
    templateUrl: './mycalander.component.html',
    styleUrls: ['./mycalander.component.css']
})
export class MycalanderComponent implements OnInit {
    title = 'easyfullcalendar';
    docId: any;
    pendingRequest: any;
    public events: any;

    constructor(private apiData: ApiIntegrationService, private toastr: ToastrService,) {
        this.docId = sessionStorage.getItem('docId');
    }

    ngOnInit() {
        this.showMonthCalander();
    }

    // calendar default view : month
    showMonthCalander() {
        let postData = {
            "month": (new Date).getMonth(),
            "year": (new Date).getFullYear()
        }
        this.pendingRequest = this.apiData.getBookedSlotMonthwise(postData).subscribe((data) => {
            if (data['statusCode'] == 200) {
                data['data'].forEach((data) => {
                    if ((data.status).toLowerCase() == 'pending') {
                        data.color = "#ffd180"
                    } else if ((data.status).toLowerCase() == 'confirmed') {
                        data.color = "#ffc107"
                    } else if ((data.status).toLowerCase() == 'cancelled') {
                        data.color = "#ff0000"
                    } else if ((data.status).toLowerCase() == 'booked') {
                        data.color = "#28a745"
                    }
                    data.title = `${data.patientName.firstName} ${data.patientName.lastName}`
                });
                this.events = data['data']
                //------------------------------
                // NOTE: Maximum settings of fullCalendar in this used plugins belongs to version-3 (three) of fullCalendar - (https://fullcalendar.io/docs/v3)
                var _self = this;
                setTimeout(() => {
                    $("#calendar").fullCalendar({
                        header: {
                            left: 'prev,next today',
                            center: 'title',
                            right: 'month,agendaWeek,agendaDay'
                        },
                        googleCalendarApiKey: 'AIzaSyDsSKWeApvsm8aSRDvUdTv2fTVTL272GMM',
                        navLinks: true,
                        editable: false,
                        eventLimit: 1,
                        defaultView: 'month',
                        timeFormat: 'H:mm',
                        displayEventEnd: true,

                        eventMouseover: function (event, jsEvent, view) {
                            $(this).attr('id', event.id);
                
                            $('#' + event.id).popover({
                                template: '<div class="popover popover-primary" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
                                title: event.title,
                                content: event.description,
                                placement: 'top',
                            });
                
                            $('#' + event.id).popover('show');
                        },
                        eventMouseout: function (event, jsEvent, view) {
                            $('#' + event.id).popover('hide');
                        },
                        
                        events: this.events,  // request to load current events
                        viewRender: function (view) {
                            // load calendar method or view for these 3 'view.name' : (month,agendaWeek,agendaDay)
                            if (view.name == 'month') {
                                //-------------------------------------
                                // change view style for events in month view
                                setTimeout(() => {
                                    $("#calendar").find(".fc-event-container").find("a").each((index, a) => {
                                        $(a).removeClass("fc-day-grid-event")
                                        $(a).attr("style").split(";").forEach((style) => {
                                            if (style.includes("background-color")) {
                                                var bg_color = style.split(":")[1]
                                                //var color_box = `<span class="color-box" style="background-color:${bg_color};padding:2px 5px;color:${bg_color};border-radius:3px;margin-right:10px;">.</span>`
                                                var color_indicator = $(a).find(".fc-content").find("span.color-box")
                                                // if (color_indicator == undefined || color_indicator == null || !color_indicator || color_indicator.length == 0) {
                                                //     $(a).find(".fc-content").prepend(color_box)
                                                // }
                                            }
                                        })
                                        //$(a).css({ "min-width": "60%", "margin": "auto", "background-color": "#28a745", "border-color": "transparent" })
                                    })
                                }, 110)
                                //-------------------------------------
                            } else if (view.name == 'agendaWeek') {
                                //-------------------------------------
                                // change view style for events in week view
                                setTimeout(() => {
                                    // $("#calendar").find(".fc-event-container").find("a").each((index, a) => {
                                    //     $(a).parent().css({ "margin-top": "15%" })
                                    //     $(a).removeClass("fc-time-grid-event fc-short")
                                    //     $(a).attr("style").split(";").forEach((style) => {
                                    //         if (style.includes("background-color")) {
                                    //             var bg_color = style.split(":")[1]
                                    //             var color_box = `<span class="color-box" style="background-color:${bg_color};padding:2px 5px;color:${bg_color};border-radius:3px;margin-right:2px;">.</span>`
                                    //             var color_indicator = $(a).find(".fc-content").find("span.color-box")
                                    //             if (color_indicator == undefined || color_indicator == null || !color_indicator || color_indicator.length == 0) {
                                    //                $(a).find(".fc-content").prepend(color_box)
                                    //              }
                                    //         }
                                    //     })
                                    //     // $(a).css({ "min-height": "50px", "min-width": "60%", "margin": "auto", "background-color": "#faf2f2", "border-color": "transparent" })
                                    // })
                                }, 110)
                                //-------------------------------------
                            } else if (view.name == 'agendaDay') {
                                //-------------------------------------
                                // change view style for events in day view
                                setTimeout(() => {
                                    // $("#calendar").find(".fc-event-container").find("a").each((index, a) => {
                                    //     $(a).removeClass("fc-short")
                                    //     $(a).attr("style").split(";").forEach((style) => {
                                    //         if (style.includes("background-color")) {
                                    //             var bg_color = style.split(":")[1]
                                    //             $(a).css({ "min-height": "30px", "background-color": "#f1f1f1", "border-color": "transparent", "border-left": `10px solid ${bg_color}` })
                                    //         }
                                    //     })
                                    // })
                                }, 110)
                                //-------------------------------------
                            }
                        },
                    })
                    // .on('click', '.fc-prev-button, .fc-next-button ', function () {
                    //     // alert('Week button clicked'); 
                    //     _self.data();
                    // });
                }
                    , 100);
                //-------------------------------------
                // change view style for events in popup in month view
                $(document).on("click", "a.fc-more", () => {
                    setTimeout(() => {
                        $("#calendar").find(".fc-event-container").find("a").each((index, a) => {
                            $(a).removeClass("fc-day-grid-event")
                            $(a).attr("style").split(";").forEach((style) => {
                                if (style.includes("background-color")) {
                                    var bg_color = style.split(":")[1]
                                    //var color_box = `<span class="color-box" style="background-color:${bg_color};padding:2px 5px;color:${bg_color};border-radius:3px;margin-right:10px;">.</span>`
                                    var color_indicator = $(a).find(".fc-content").find("span.color-box")
                                    // if (color_indicator == undefined || color_indicator == null || !color_indicator || color_indicator.length == 0) {
                                    //     $(a).find(".fc-content").prepend(color_box)
                                    // }
                                }
                            })
                            //$(a).css({ "min-width": "60%", "margin": "auto", "background-color": "#28a745", "border-color": "transparent" })
                        })
                    }, 10)
                })
                //-------------------------------------
            } else {
                this.toastr.error(data['message']);
            }
        }, error => {
            // this.blockUI.stop();
            this.toastr.error('Not able to connect host, please try again');
        })

    }

    data() {
        //
    }

}