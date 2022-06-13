class AdminController < ApplicationController
    http_basic_authenticate_with name: "admin", password: "Lovelace"
    $inf_dir = "#{Rails.root}/public/data/sample_plot/"
    $data_dir = "#{Rails.root}/public/data/"
    def index
        @projects = Project.order(:project_name)
        #@organs = Organ.order(:primary_site)
        @cancers = Cancer.order(:cancer_name)
        @ana_cate = AnalysisCategory.order(:name)
        @ac_attrs = AnalysisCategory.column_names
        @viz = Visualizer.order(:name)
        @viz_attrs = Visualizer.column_names
        @ana = Analysis.order(:name)
        @a_attrs = Analysis.column_names
    end

    def modify_sample_inf
        #redirect_to import_inf_table_project_samples_path(:project_id=>params[:project_id], :file=>params[:file])
        @project = Project.find(params[:project_id])
        n1 = @project.project_name
        up_file = params[:file]
        # uploader = AbdUploader.new(n1)
        # uploader.store!(up_file)
        if up_file.respond_to?(:read)
            data = up_file.read
            lines = data.split("\n")
            names = lines[0].chomp.split("\t") 
            n_sample = lines.length() - 1 #number of sample
            n_key = names.length() - 1
            pj_name = names[0]
            keys = names[1..n_key]
            i = 1
            all_json = {}
            while i < lines.length()
                line = lines[i]
                sample_info = line.split("\t")
                s_name = sample_info[0].chomp
                f_path = "#{$inf_dir}#{n1}_#{s_name}.tsv"
                f = File.open(f_path, "w")
                s = "#{n1}\t#{s_name}"
                keys.each_with_index do |k, index|
                    value =  sample_info[index + 1]
                    if value.to_f != 0
                        s += "\n"
                        s += "#{k}\t#{value}"
                    end
                end
                i+=1
                f.write(s)
                f.close
            end
        else
            logger.error "Bad file_data: #{up_file.class.name}: #{up_file.inspect}"
        end
        redirect_to '/admin', notice: "ALL immune infiltration data uploaded."
    end

    def update_files
        file_path = "#{Rails.root}/public/data/project_files.csv"
        file = File.open(file_path,"w")
        s = "id,project_name,clinical,subtype,rna_immu,RNA,all"
        boxplot_selector= ["Consensus","ABIS","CIBERSORTX","CIBERSORT","ConsensusTME","EPIC","ImmuCellAI","MCPcounter","quanTIseq","TIMER", "xCell"]

        boxplot_selector.each do |boxplot_selected|
            s += ",#{boxplot_selected}"
        end
        @projects = Project.order(:id)
        @projects.each do |project|
            name = project.project_name
            clinical_file_path = $data_dir+"/clinical/sample/Clinical_" + name + ".csv";
            subtype_file_path = $data_dir+"/subtype/c1_c6/project/" + name + "_c1_c6.csv";
            rna_immu_file_path = $data_dir+"/immuneregulator/immuReg_" + name + ".csv";
            rna_file_path = $data_dir+"/RNA/RNA_"+ name + ".csv";
            all_file_path = $data_dir+"/all_method/"+name+"_all.tsv";
            s+="\n"
            s+="#{project.id}"
            s+=",#{name}"

            if File.exists?(clinical_file_path)
                s+= ",true"
            else
                s+=',false'
            end
            if File.exists?(subtype_file_path)
                s+= ",true"
            else
                s+=',false'
            end            
            if File.exists?(rna_immu_file_path)
                s+= ",true"
            else
                s+=',false'
            end
            if File.exists?(rna_file_path)
                s+= ",true"
            else
                s+=',false'
            end
            if File.exists?(all_file_path)
                s+= ",true"
            else
                s+=',false'
            end
            boxplot_selector.each do |boxplot_selected|
                cellData_file_path = $data_dir + "cell_data/" + boxplot_selected + "/" + name + "_" + boxplot_selected + ".csv";
                if File.exists?(cellData_file_path)
                    s+= ",true"
                else
                    s+=',false'
                end
            end
            
        end
        file.write(s)
        file.close
        redirect_to '/admin', notice: "ALL files updated."
    end

    def update_samples_num_table_and_reprocessedColumns
        #generate cancer type and their sample numbers
        @cancers = Cancer.order(:cancer_name)
        csf_path = "#{$data_dir}sample_num/cancer_samples.tsv"
        csf = File.open(csf_path, "w")
        s = "cancer_name\tsample_number"
        @cancers.each do |cancer|
            ct = cancer.cancer_name
            sn = cancer.number_of_samples
            s += "\n"
            s += "#{ct}\t#{sn}"
        end 
        csf.write(s)
        csf.close
        #generate project and their sample numbers
        @cancers.each do |cancer|
            ct = cancer.cancer_name
            cprojects = cancer.projects.order(:project_name)
            psf_path = "#{$data_dir}sample_num/#{ct}_project_samples.tsv"
            psf = File.open(psf_path, "w")
            s = "project\tsample_number"
            cprojects.each do |cp|
                pn = cp.project_name
                sn = cp.samples.count
                s += "\n"
                s += "#{pn}\t#{sn}"
            end
            psf.write(s)
            psf.close
        end
        # @projects = Project.order(:project_name)
        # psf_path = "#{$data_dir}sample_num/project_samples.tsv"
        # psf = File.open(psf_path, "w")
        # s = "project\tsample_number"
        # @projects.each do |project|
        #     pn = project.project_name
        #     sn = project.samples.count
        #     s += "\n"
        #     s += "#{pn}\t#{sn}"
        # end
        # psf.write(s)
        # psf.close

        redirect_to '/admin', notice: "ALL Projects/Cancer types with samples number files updated."
    end 

    #actually no need to do file integration here - cell data
    def make_analysis_cancer_files
        all_analysis_methods = [""] # add eight analysis method here for cell data
        @cancers = Cancer.order(:cancer_name)
        all_analysis_methods.each do |analysis_method|
            @cancers.each do |cancer|
                ctype = cancer.cancer_name
                cprojects = cancer.projects
                project_file_names = []
                cprojects.each do |project|
                    pname = project.project_name
                    analysis_project_file_name = p_name + '_' + analysis_method + '.csv'
                    project_file_names.push(analysis_project_file_name)
                end
                firstpname = project_file_names[0]
                firstFPath = "#{$ovv_dir}analysis/#{analysis_method}/projects/#{firstpname}"
                ana_headers = CSV.open(firstFPath, &:readline)

                analysis_cancer_name = ctype + "_" + analysis_method + ".csv"
                cfile_path = "#{$ovv_dir}analysis/#{analysis_method}/cancers/#{analysis_cancer_name}"
                CSV.open(cfile_path, "wb", write_headers: true, headers: ana_headers) do |csv|
                    project_file_names.each do |ppath|  # for each of your csv files
                        absPath = "#{$ovv_dir}analysis/#{analysis_method}/projects/#{ppath}"
                        CSV.foreach(absPath, headers: true, return_headers: false) do |row| # don't output the headers in the rows
                            csv << row # append to the final file
                        end
                    end
                end
            end
        end
    end


    def make_subtype_cancer_files
        # integrate project data to cancer data
        # for subtype data, we will only have the C1-C6 now
        all_subtype_methods = ["c1_c6"] # add eight subtype method here
        cancers = Cancer.order(:cancer_name)
        all_subtype_methods.each do |subtype_method|

            cancers.each do |cancer|
                ctype = cancer.cancer_name
                cprojects = cancer.projects
                if cprojects.count > 0
                    firstpname = cprojects.first.project_name
                    firstFName =  'TCGA_ACC_' + subtype_method + '.csv' 
                    firstFPath = "#{$data_dir}subtype/#{subtype_method}/project/#{firstFName}"
                    sub_headers = CSV.open(firstFPath, &:readline)

                    subtype_cancer_name = ctype + '_' + subtype_method + ".csv"
                    cfile_path = "#{$data_dir}subtype/#{subtype_method}/cancer/#{subtype_cancer_name}"
                    CSV.open(cfile_path, "wb", write_headers: true, headers: sub_headers) do |csv|
                        cprojects.each do |project|  # for each of your csv files
                            pname = project.project_name
                            csv << [pname]
                            fname = pname + '_' + subtype_method + '.csv' 
                            fpath = "#{$data_dir}subtype/#{subtype_method}/project/#{fname}"
                            if File.exists?(fpath)
                                CSV.foreach(fpath, headers: true, return_headers: false) do |row| # don't output the headers in the rows
                                    csv << row # append to the final file
                                end
                            end
                        end
                    end
                end
            end

            #integrate all TCGA projects to a single file
            fnameTCGA = subtype_method + '_TCGA_all.csv'
            fpathTCGA = "#{$data_dir}subtype/#{subtype_method}/#{fnameTCGA}"
            firstctype = cancers.first.cancer_name
            firstTCGAfname = "TCGA_" + firstctype + '_' + subtype_method  + ".csv"
            firstTCGAfpath = "#{$data_dir}subtype/#{subtype_method}/project/#{firstTCGAfname}"
            sub_headers = CSV.open(firstTCGAfpath, &:readline)

            CSV.open(fpathTCGA, "wb", write_headers: true, headers: sub_headers) do |csv|
                cancers.each do |cancer|
                    ctype = cancer.cancer_name
                    fname = "TCGA_" + ctype + '_' + subtype_method  + ".csv"
                    fpath = "#{$data_dir}subtype/#{subtype_method}/project/#{fname}"
                    if File.exists?(fpath)
                        csv << [ctype]
                        CSV.foreach(fpath, headers: true, return_headers: false) do |row|
                            csv << row
                        end
                    end
                end
            end
        end
        redirect_to '/admin', notice: "ALL subtype files has been integrated!"

    end

    def update_columns_cancer
        cancer = Cancer.find(params[:cancer_id])

            #update the number of projects
            cancer.update_attribute(:number_of_related_projects, cancer.projects.count)

            projects_of_cancer = cancer.projects

            num_samples = 0
            subtype = []
            projects_of_cancer.each do |project|
                
                file_name = project.project_name + ".csv"
                file_path = "#{$data_dir}RNA/RNA_" + file_name
                if File.exists?(file_path)
                    num_gene = CSV.foreach(file_path, headers: true).count - 1
                    project.update_attribute(:num_of_observed_genes, num_gene)
                end
                
                project.update_attribute(:num_of_samples, project.samples.count)
                num_samples += project.samples.count

                #update the subtype from c_tumor_subtype
                samples_of_project = project.samples
                samples_of_project.each do |sample|
                    s_tumor_type = sample.c_tumor_type
                    if !subtype.include?(s_tumor_type)
                        subtype.push(s_tumor_type)
                    end
                end
            end
            cancer.update_attribute(:number_of_samples, num_samples)
            cancer.update_attribute(:sub_cancer, subtype.join(","))
        redirect_to '/admin', notice: "Selected cancer has been calculated!"
    end

    def update_columns
        projects = Project.all
        cancers = Cancer.all

        #automatically calculatethe empty or to-be-updated columns 
        projects.each do |project|

            #number of genes
            file_name = project.project_name + ".csv"
            file_path = "#{$data_dir}RNA/RNA_" + file_name
            if File.exists?(file_path)
                num_gene = CSV.foreach(file_path, headers: true).count - 1
                project.update_attribute(:num_of_observed_genes, num_gene)
            end
            
            #number of samples
            project.update_attribute(:num_of_samples, project.samples.count)

        end

        #update the numnber of projets for cancers
        #update subtype for cancers
        cancers.each do |cancer|

            #update the number of projects
            cancer.update_attribute(:number_of_related_projects, cancer.projects.count)

            projects_of_cancer = cancer.projects

            num_samples = 0
            subtype = []
            projects_of_cancer.each do |project|
                #update the number of samples
                num_samples += project.samples.count

                #update the subtype from c_tumor_subtype
                samples_of_project = project.samples
                samples_of_project.each do |sample|
                    s_tumor_type = sample.c_tumor_type
                    if !subtype.include?(s_tumor_type)
                        subtype.push(s_tumor_type)
                    end
                end
            end
            cancer.update_attribute(:number_of_samples, num_samples)
            cancer.update_attribute(:sub_cancer, subtype.join(","))
        end
        redirect_to '/admin', notice: "ALL columns of cancers has been calculated!"

    end

    # def split_processed_columns_file
    #     #redirect_to import_inf_table_project_samples_path(:project_id=>params[:project_id], :file=>params[:file])
    #     up_file = params[:file]
    #     reprocess_info =  = CSV.parse(upfile, headers: true)

    #     split_json = {}

    #     row_num = reprocess_info.length()
    #     for i in 
    #     reprocess_info.each do |key, index|
        
    #     # uploader = AbdUploader.new(n1)
    #     # uploader.store!(up_file)
    #     if up_file.respond_to?(:read)
    #         data = up_file.read
    #         lines = data.split("\n")
    #         names = lines[0].chomp.split("\t") 
    #         n_sample = lines.length() - 1 #number of sample
    #         n_key = names.length() - 1
    #         pj_name = names[0]
    #         keys = names[1..n_key]
    #         i = 1
    #         all_json = {}
    #         while i < lines.length()
    #             line = lines[i]
    #             sample_info = line.split("\t")
    #             s_name = sample_info[0].chomp
    #             f_path = "#{$inf_dir}#{n1}_#{s_name}.tsv"
    #             f = File.open(f_path, "w")
    #             s = "#{n1}\t#{s_name}"
    #             keys.each_with_index do |k, index|
    #                 value =  sample_info[index + 1]
    #                 if value.to_f != 0
    #                     s += "\n"
    #                     s += "#{k}\t#{value}"
    #                 end
    #             end
    #             i+=1
    #             f.write(s)
    #             f.close
    #         end
    #     else
    #         logger.error "Bad file_data: #{up_file.class.name}: #{up_file.inspect}"
    #     end
    #     redirect_to '/admin', notice: "ALL immune infiltration data uploaded."
    # end

    def delete_samples
        up_file = params[:file]
        if up_file.respond_to?(:read)
            data = up_file.read
            lines = data.split("\n")
            lines.each do |line|
                id = line.chomp
                if Sample.exists? id
                    Sample.find(id).destroy
                end
            end

        else
            logger.error "Bad file_data: #{up_file.class.name}: #{up_file.inspect}"
        end
        redirect_to '/admin', notice: "Samples deleted."
    end

    def update_all_samples
        Sample.import(params[:file])
        cancers = Cancer.order(:cancer_name)
        cancers.each do |cancer|
            samples_num = 0
            cancer.projects.each do |project|
                samples_num += project.samples.count
            end
            cancer.update_attribute(:number_of_samples, samples_num)
        end
        redirect_to '/admin', notice: "Samples imported."
    end


    #consider delete later
    def update_all_organs
        Organ.import(params[:file])
        redirect_to '/admin', notice: "Organs imported."
    end

    def update_all_cancers
        Cancer.import(params[:file])
        redirect_to '/admin', notice: "Cancers imported."
    end

    def modify_viz
        Visualizer.import(params[:file])
        redirect_to '/admin', notice: "Visualization imported."
    end

    def modify_ana_cate
        AnalysisCategory.import(params[:file])
        redirect_to '/admin', notice: "Analysis category imported."
    end
    
    def modify_ana
        Analysis.import(params[:file])
        redirect_to '/admin', notice: "Analysis module imported."
    end

    def add_img
        file = params[:image_file]
        @filename = file.original_filename
        File.open("#{Rails.root}/app/assets/images/#{@filename}", "wb") do |f|
            f.write(file.read)
        end
        redirect_to '/admin', notice: "Image added."
    end

    def modify_viz_source
        VizDataSource.import(params[:file])
        redirect_to '/admin', notice: "Visualization source imported."
    end
end

