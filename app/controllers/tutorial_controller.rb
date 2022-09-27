class TutorialController < ApplicationController
    skip_before_action :validate_cookie, only: [:database1,:database2,:database3,:database4,:database5,:database6,:analysis1,:analysis2,:analysis4,:analysis4]

    def database1
    end
    def database2
    end
    def database3
    end
    def database4
    end
    def database5
    end
    def database6
    end    
    def analysis1
    end
    def analysis2
    end
    def analysis3
        @all_analysis = Analysis.all;
        @all_pipeline = AnalysisPipeline.all;

        @list= []
        
        @all_analysis.each_with_index do |a, idx|
            if(a.hidden == false)
                @list.push({value:a, text:a.name, ana:a})
            end
        end
        @all_pipeline.each_with_index do |a, idx|
            if(a.hidden == false)
                @list.push({value:a, text:a.name, ana:a})
            end
        end
        gon.push text: @list
        if(@list.length !=0)
        gon.push first: @list[0]
        end
        
    end
    def analysis4
    end
    def mub
    end
end
